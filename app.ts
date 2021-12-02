import Fastify from 'fastify'
import Fastify_cors from 'fastify-cors'
import { Static, Type } from '@sinclair/typebox'

const fastify = Fastify({
     logger: true
});

const PORT = process.env.PORT || 5000;

fastify.register(Fastify_cors, {});

fastify.get('/', async (request, reply) => {
     reply.type('application/json').code(200)

     return {
          // mbi: generateMBI(),
          // valid_mbi: valid_mbi
     }
});

fastify.listen(PORT, (err, address) => {
     if (err) throw err
     // Server is now listening on ${address}
})

function getMBIFormat() {
     let numeric_c = "123456789";
     let numeric_n = "0123456789";
     let alphabetic = "ACDEFGHJKMNPQRTUVWXY";

     let mbi_format: string[] = [
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
     let mbi_format : string[] = getMBIFormat();
     let new_mbi : string = "";
     for (var i = 0; i < mbi_format.length; i++) {
          let format_for_position = mbi_format[i];
          new_mbi += format_for_position[randomIntFromInterval(0, format_for_position.length - 1)];
     }
     new_mbi = insertIntoString(new_mbi, 4, "-");
     new_mbi = insertIntoString(new_mbi, 8, "-");
     return new_mbi;
}

fastify.get('/generate', async (request, reply) => {
     return { mbi: generateMBI() };
});

function randomIntFromInterval(min, max) { // min and max included 
     return Math.floor(Math.random() * (max - min + 1) + min)
}

function insertIntoString(str, index, value) {
     return str.substr(0, index) + value + str.substr(index);
}

const ivalidate_post = Type.Object({
     mbi: Type.String()
});
type ivalidate_post_type = Static<typeof ivalidate_post>;
fastify.post<{ Body : ivalidate_post_type }>('/validate', async (request, reply) => {
     let mbi : string = request.body.mbi;
     // console.log(request.body);
     if (mbi == null || mbi == "")
          return { valid: false, reason: "No input." };

     mbi = mbi.replace(/-/g, "");
     if (mbi.length != 11)
          return { valid: false, reason: "Invalid length." };

     let mbi_format : string[] = getMBIFormat();
     
     for (var i = 0; i < 11; i++) {
          // console.log(mbi[i]);
          if (mbi_format[i].indexOf(mbi[i]) == -1) {
               return { valid: false, reason: "Character at position " + (i + 1) + " is invalid. (not counting dashes)" };
          }
     }

     return { valid: true };
});