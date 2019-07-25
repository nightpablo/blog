import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
	public page_title:string;
	public user: User;
	public status : string;
	public token;
	public identity;


  constructor(
  	private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  	) { 
  	this.page_title = 'Identificate:';
  	this.user = new User(1,'','','ROLE_USER','','','','');
  }

  ngOnInit() {
    // Se ejecuta siempre este componente y solo
    // Cierra seccion si llega el parametro sure
    this.logout();
  }

  onSubmit(form){
  	  this._userService.signup(this.user).subscribe(
      response=>{
        // response devuelve el token si esta todo ok        
        if(response.status!="error"){
          this.status = response.status;
          this.token = response;
          
          // Vuelvo a realizar la misma llamada, para que me de los
          // datos del usuario
          //
          
          this._userService.signup(this.user,true).subscribe(
	      response=>{
	        // devuelve datos del usuario
	        	this.identity = response;

            // console.log('login|onsubmit: '+JSON.stringify(response));

	        	//persisto los datos del usuario identificado
	        	localStorage.setItem('token',JSON.stringify(this.token));
	        	localStorage.setItem('identity',JSON.stringify(this.identity));

	        	// limpo pantalla
	            form.reset();    

            //redireccion a inicio
            this._router.navigate(['inicio']);

	      },
	      error=>{
	        this.status = 'error';
	        console.log(<any>error);
	      });		      
          
        } else {
	          this.status = 'errors';
	          console.log(this.status);
        }        
      },
      error=>{
        this.status = 'error';
        console.log(<any>error);
      }
    );  
  }

  logout(){
    this._route.params.subscribe(params=>{
      //con el mas lo transformo a la cadena en entero
      let logout = +params['sure'];

      if(logout==1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity=null;
        this.token=null;

        //redireccion a inicio
        this._router.navigate(['inicio']);
      }
    })
  }
}
