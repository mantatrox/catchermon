import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Document, Page } from "react-pdf";
import entitiesConfig from "../../config/entities.json";
import { useDispatch } from "react-redux";
import { dispatcher as IoDispatcher } from "../../store/io";

function Draw() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  React.useEffect(() => {
    dispatcher.setTabValue(3);
  }, []);

  return (
    <Box style={{ margin: "2em" }}>
      <p>
        <span style={{ color: "#ff0000" }}>
          <strong>
            Bitte ab 15 Uhr im Sp&auml;tdienst die Liefertermine in der
            Mietsiebanforderung beachten. Mietsiebe, die am n&auml;chsten Tag
            angeliefert werden sollen bitte dringend ausl&ouml;sen und den
            Betreff des Tickets an das SCE deutlich als Express kennzeichnen.
          </strong>
        </span>
      </p>
      <p>Der Liefertermin steht mittlerweile auch im Betreff des Tickets:</p>
      <img src={process.env.PUBLIC_URL + "/guide/1.png"} alt="1" />
      <p>Oder im Ticket:</p>
      <img src={process.env.PUBLIC_URL + "/guide/2.png"} alt="2" />

      <p>
        <u>Ausgangslage:</u> Anforderung Mietsieb
      </p>
      <img src={process.env.PUBLIC_URL + "/guide/3.png"} alt="1" />

      <ol>
        <li>Bestellart: MSB A2_Mietsiebestellung</li>
        <li>Kreditor: KV882 Helios Beschaffungsmanagement</li>
        <li>
          Artikel 78000583 Dummy &bdquo;Mietsieb&ldquo; -&gt; Kurztext des
          Artikels bitte &uuml;berschreiben:
        </li>
      </ol>
      <p>
        Mietsieb &bdquo;Bezeichnung Mietsieb&ldquo;, OP-Datum, z.B. Mietsieb
        Claw II OP 22.05.
      </p>
      <ol start={4}>
        <li>Kontierung &bdquo;1&ldquo; f&uuml;r unbewerteten Wareneingang</li>
        <li>Im Belegkopf, Reiter &bdquo;Partner&ldquo; Kreditor eintragen</li>
        <li>
          In den Positionsdetails , Reiter &bdquo;Texte&ldquo; -&gt;
          Materialbestelltext&ldquo;, Details zum Mietsieb eintragen (bitte
          keine Patienten-ID oder Diagnosen mitschicken), bitte die Mail-Adresse
          des Anwenders nicht mitschicken (sonst gehen die ABs dahin)
          z.B.:&nbsp;
          <img src={process.env.PUBLIC_URL + "/guide/4.png"} alt="4" />
        </li>
      </ol>
      <ol start={7}>
        <li>
          Speichern der internen Mietsiebbestellung im Kundenhaus:
          450000&hellip;
        </li>
        <li>
          Im Ticket &uuml;ber &bdquo;Verschiedenes&ldquo; &gt; &bdquo;Freie
          Felder&ldquo; im Betreff den Hinweis{" "}
          <strong>&bdquo;Express&ldquo;</strong> vermerken und die int. AN
          einf&uuml;gen
        </li>
        <li>
          Das Ticket &uuml;ber &Auml;ndern der Queue an das SCE senden, mit dem
          Vermerk: Bitte um Bestellung des Mietsiebes 45000&hellip; und
          R&uuml;ckmeldung der externen AN und AB
        </li>
      </ol>
      <p>Noch ein Hinweis:</p>
      <p>
        Einige H&auml;user m&ouml;chten die Siebe oftmals direkt in den Steri
        geliefert bekommen, gerade wenn es sich um dringende Bestellungen
        handelt:
      </p>
      <img src={process.env.PUBLIC_URL + "/guide/5.png"} alt="5" />

      <p>
        Daf&uuml;r bitte in der Bestellung im Reiter Anlieferadresse, bei
        &bdquo;Kunde&ldquo; den WE f&uuml;r den jeweiligen Steri
        &nbsp;eintragen.
      </p>
      <img src={process.env.PUBLIC_URL + "/guide/6.png"} alt="6" />
      <img src={process.env.PUBLIC_URL + "/guide/7.png"} alt="7" />

      <p>
        <span style={{ color: "#ff0000" }}>
          <strong>
            Bitte f&uuml;r EvB immer direkt an den OP schicken, nicht an den
            Steri, egal was in der Anforderung steht!
          </strong>
        </span>
      </p>
      <p>&nbsp;</p>
      <p>Wie geht es weiter?&nbsp;</p>
      <p>
        Das SCE antwortet dem Ersteller der Mietsiebanforderung, entweder im
        Ticket oder per Mail, der jeweilige Eink&auml;ufer der die interne AN
        angelegt hat, steht im CC.
      </p>
      <img src={process.env.PUBLIC_URL + "/guide/8.png"} alt="8" />

      <p>
        <u>
          Der Anforderer muss also in diesem Falle nicht mehr extra durch uns
          informiert werden.
        </u>
      </p>
      <p>&nbsp;</p>
      <p>
        <span style={{ color: "#ff0000" }}>
          <strong>
            An dieser Stelle ist f&uuml;r die Notfall- bzw. Expressbestellungen
            alles erledigt, bitte einfach eine kurze Mail an uns, wenn ihr ein
            Sieb bestellen musstet, dann k&ouml;nnen wir die letzten Schritte
            noch am n&auml;chsten Tag erledigen
          </strong>
        </span>
      </p>
      <p>&nbsp;</p>
      <p>
        <u>
          F&uuml;r die regul&auml;re Vertretung gibt es noch ein paar
          zus&auml;tzliche Schritte:
        </u>
      </p>
      <ul>
        <li>
          Wenn das SCE die Auftragsbest&auml;tigung der Firma erh&auml;lt, dann
          wird diese entweder in einer extra Mail oder im Ticket an den Anwender
          und den Eink&auml;ufer geschickt (bitte die Anliefer- und OP-Daten
          bzw. sonstige Hinweise auf der AB kontrollieren)
        </li>
        <li>
          In den Ost &bdquo;neu&ldquo; H&auml;usern werden die Kontakte aus dem
          Anforderungsticket informiert
        </li>
      </ul>
      <ul>
        <li>
          In den Ost &bdquo;alt&ldquo; H&auml;user werden zus&auml;tzlich zu dem
          Besteller noch nachstehend genannte Anwender per Mail informiert:
        </li>
      </ul>
    </Box>
  );
}

export default Draw;
