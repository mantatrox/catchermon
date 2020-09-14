import dh from "../dataHandler";
import moment, { Moment } from "moment";
import {
  DistributionStatus,
  ExpireType,
  TimeOffset
} from "../../model/entities";
import { emitChange } from "../express/socket";

async function expirationTimer() {
  const entities = await dh.entities.get({}, true);
  const currentDate = moment();

  for (const entity of entities) {
    let changed = false;
    const expiration = entity.options.expiration;
    if (!expiration) continue;

    for (const item of entity.items) {
      if (!item.insertDate) continue;

      let newDate: Moment;

      switch (expiration.expireType) {
        case ExpireType.ONCOLUMN:
          if (!expiration.expireProp) continue;
          // eslint-disable-next-line no-case-declarations
          const ip = item.properties.find(
            (i) => i.propKey === expiration.expireProp
          );

          if (!ip) continue;

          newDate = moment(ip.propValue);
          break;

        case ExpireType.ONINSERT:
          newDate = moment(item.insertDate);
          break;

        default:
          newDate = moment();
      }

      switch (expiration.offsetType) {
        case TimeOffset.MINUTES:
          newDate.add(expiration.offset, "minutes");
          break;

        case TimeOffset.HOURS:
          newDate.add(expiration.offset, "hours");
          break;

        case TimeOffset.DAYS:
          newDate.add(expiration.offset, "days");
          break;

        default:
          break;
      }

      if (newDate > currentDate) continue;

      switch (item.distribution.status) {
        case DistributionStatus.BOOKED:
          await dh.objects.deliver(item._id, item.distribution.referent);
          changed = true;
          break;

        default:
          await dh.objects.expire(item._id, item.referent);
          changed = true;
          break;
      }
    }

    if (!changed) continue;
    const pageId = (await dh.pages.getByEntityId(entity._id))._id;
    emitChange(pageId, entity._id);
  }
}

function startTimers() {
  expirationTimer();
  setInterval(expirationTimer, 60000);
}

export default startTimers;
