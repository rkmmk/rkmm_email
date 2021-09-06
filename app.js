(function () {
  "use strict";

  window.authClick = function () {
    // https://baloncestoalcorcon.es/Dani/2016/03/29/how-to-get-my-gmail-contacts-with-javascript-google-api/
    // Your Client ID is retrieved from your project
    //in the Developer Console => https://console.developers.google.com
    // var CLIENT_ID = '277520563342-k20q6oq5dsi9m7tk1ml8kgnrvcucntlv.apps.googleusercontent.com';
    // var CLIENT_ID = '261089695697-b4a2ac07iiik0npdhaud3860isou7bfh.apps.googleusercontent.com';
    var CLIENT_ID =
      "573253174981-4v0536c765kvcv8m1alr0emrg9fj8lp1.apps.googleusercontent.com";
    //'mygoogleid.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/contacts.other.readonly"];

    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false,
      },
      authResult
    );

    return false;
  };

  /**
   * Handle response from authorization server.
   * @param {Object} authResult Authorization result.
   */
  function authResult(_Result) {
    var _Div = document.getElementById("divauthresult");
    if (_Result && !_Result.error) {
      // Auth OK! => load API.
      _Div.style.display = "none";
      loadPeopleApi();
    } else {
      // Auth Error, allowing the user to initiate authorization by
      _Div.innerText = ":( Authtentication Error : " + _Result.error;
    }
  }

  /**
   * Load Google People client library. List Contact requested info
   */
  function loadPeopleApi() {
    gapi.client.load(
      "https://people.googleapis.com/$discovery/rest",
      "v1",
      showContacts
    );
  }

  divtableresult.innerHTML = '';

  /**
   * Show Contacts Details display on a table pagesize = 100 connections.
   */
  function showContacts(nextPageToken) {
    //https://people.googleapis.com/v1/otherContacts
    var requestBody = {
      pageSize: 150,
      readMask: "names,emailAddresses",
    };
    if(nextPageToken) {
      requestBody.nextPageToken = nextPageToken;
    }
    var request = gapi.client.people.otherContacts.list(requestBody);

    request.execute(function (resp) {
      var connections = resp.otherContacts;

      if (connections.length > 0) {
        var emails = [];
        for (var i = 0; i < connections.length; i++) {
          var person = connections[i];
          Array.prototype.push.apply(
            emails,
            person.emailAddresses
              ? person.emailAddresses.map(function (item) {
                  return item.value;
                })
              : []
          );
        }
        divtableresult.innerHTML +=
          "<br><br>==================================================<br>Contacts found : <br>" +
          emails.length +
          "<br> <br>" +
          emails.join("; ") +
          "<br>==================================================";
      }

      if(resp.nextPageToken) {
        showContacts(resp.nextPageToken);
      }
    });
  }
  // https://stackoverflow.com/questions/51900190/send-email-via-gmail-api-javascript
  // https://stackoverflow.com/questions/39536932/unable-to-send-rich-text-emails-with-gmail-api
  // https://doc.corezoid.com/docs/google-oauth
  function listLabels() {
    gapi.client.gmail.users.labels
      .list({
        userId: "me",
      })
      .then(function (response) {
        var labels = response.result.labels;
        appendPre("Labels:");

        if (labels && labels.length > 0) {
          for (i = 0; i < labels.length; i++) {
            var label = labels[i];
            appendPre(label.name);
          }
        } else {
          appendPre("No Labels found.");
        }
      });
  }
})();
