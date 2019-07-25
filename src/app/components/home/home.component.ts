import { Component, OnInit } from '@angular/core';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';
import {global} from '../../services/global';
import { UserService } from '../../services/user.service';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[PostService, UserService]
})
export class HomeComponent implements OnInit {
	public page_title:string;
	public url;
	public posts: Array<Post>;
	public identity;
	public token;

  constructor(
  		private _postService: PostService,
  		private _userService: UserService
  	) { 
  	this.page_title = 'Inicio';
  	this.url = global.url;
  	this.identity = this._userService.getIdentity();
  	this.token =this._userService.getToken();
  }

  ngOnInit() {
    console.log('por aca');
  	this.getPosts();
  }
  

  getPosts(){
  	this._postService.getPosts().subscribe(
  		response =>{
  			if(response.status=='success'){
  				this.posts=response.posts;
  			}else{
  				console.log('ErroR');
  			}
  		},
  		error=>{
  			console.log(error);
  		}
  	);
  }

  deletePost(id){
    console.log('Por borrar....');
    this._postService.delete(this.token,id).subscribe(
      response=> {
        this.getPosts();
      },
      error => {
        console.log(error);
      });

  }
}
