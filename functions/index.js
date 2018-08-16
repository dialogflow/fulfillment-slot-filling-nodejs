/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';

 const admin = require('firebase-admin');
 const functions = require('firebase-functions');
 const {WebhookClient} = require('dialogflow-fulfillment');

 process.env.DEBUG = 'dialogflow:debug';

 const ADLIBS_INTENT = 'makeAdlibStory';

 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({request, response});
   console.log('Req headers: ' + JSON.stringify(request.headers));
   console.log('Req body: ' + JSON.stringify(request.body));

   function makeAdlibs(agent) {
     const [color, nation, year] = [agent.parameters['color'], agent.parameters['geo-country'], agent.parameters['number']];
     let missingSlots = [];
     if (!color) { missingSlots.push('color'); }
     if (!nation) { missingSlots.push('nation'); }
     if (!year) { missingSlots.push('year'); }

     if (missingSlots.length === 1){
        agent.add(`Looks like you didn't provide a ${missingSlots[0]}`);
      }
      else if (missingSlots.length === 2){
         agent.add(`Ok, I need two more things, a ${missingSlots[0]} and ${missingSlots[1]}`);
     }
     else if (missingSlots.length === 3){
         agent.add(`Ok, I need all 3 things still: a ${missingSlots[0]}, ${missingSlots[1]}, and ${missingSlots[2]}`);
     } else {
       agent.add(`So according to David Attenborough, back in the year
       ${year}, the nearly extinct yet exquisite,
       ${color}-bellied fox was introduced to ${nation} and now flourishes in over 361 regions.`);
     }
   }

   let intentMap = new Map();
   intentMap.set(ADLIBS_INTENT, makeAdlibs);
   agent.handleRequest(intentMap);
 });
