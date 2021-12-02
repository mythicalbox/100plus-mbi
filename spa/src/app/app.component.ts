import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface mbi_response {
     mbi : string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
     title : string = 'MBI Generator and Validator';
     log : string = "";
     mbi_to_validate : string = "";
     validate_response : string = "";

     constructor(private http: HttpClient) { }
  
     Generate() {
          this.http.get<mbi_response>("generate")
               .subscribe((response : mbi_response) => {
                    this.log = response.mbi + "<br />" + this.log;
               });
     }

     Validate() {
          this.http.post<mbi_response>("validate", { mbi: this.mbi_to_validate })
          .subscribe((response) => {
               this.validate_response = JSON.stringify(response);
          });
     }
}
