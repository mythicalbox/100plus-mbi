const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
     extended: true
 }));
 app.use(bodyParser.json());

app.get('/', (req, res) => {
     // reply.type('application/json').code(200)

     res.send({
          // mbi: generateMBI(),
          // valid_mbi: valid_mbi
     });
});


function getMBIFormat() {
     let numeric_c = "123456789";
     let numeric_n = "0123456789";
     let alphabetic = "ACDEFGHJKMNPQRTUVWXY";

     let mbi_format = [
          numeric_c, // pos 1
          alphabetic, // pos 2
          alphabetic + numeric_n, // pos 3
          numeric_n, // pos 4
          alphabetic, // pos 5
          alphabetic + numeric_n, // pos 6
          numeric_n,  // pos 7
          alphabetic,  // pos 8
          alphabetic,  // pos 9
          numeric_n,  // pos 10
          numeric_n  // pos 11
     ];

     mbi_format
     return mbi_format;
}

function generateMBI() {
     let mbi_format = getMBIFormat();
     let new_mbi = "";
     for (var i = 0; i < mbi_format.length; i++) {
          let format_for_position = mbi_format[i];
          new_mbi += format_for_position[randomIntFromInterval(0, format_for_position.length - 1)];
     }
     new_mbi = insertIntoString(new_mbi, 4, "-");
     new_mbi = insertIntoString(new_mbi, 8, "-");
     return new_mbi;
}

app.get('/generate', (req, res) => {
     res.send({ mbi: generateMBI() });
});

function randomIntFromInterval(min, max) { // min and max included 
     return Math.floor(Math.random() * (max - min + 1) + min)
}

function insertIntoString(str, index, value) {
     return str.substr(0, index) + value + str.substr(index);
}

app.post('/validate', (req, res) => {
     let mbi = req.body.mbi;
     // console.log(request.body);
     if (mbi == null || mbi == "")
          res.send({ valid: false, reason: "No input." });

     mbi = mbi.replace(/-/g, "");
     if (mbi.length != 11)
          res.send({ valid: false, reason: "Invalid length." });

     let mbi_format = getMBIFormat();
     
     for (var i = 0; i < 11; i++) {
          // console.log(mbi[i]);
          if (mbi_format[i].indexOf(mbi[i]) == -1) {
               res.send({ valid: false, reason: "Character at position " + (i + 1) + " is invalid. (not counting dashes)" });
          }
     }

     res.send({ valid: true });
});

app.listen(PORT, () => {
     console.log("Server is now listening on port " + PORT);
})
