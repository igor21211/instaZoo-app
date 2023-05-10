import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {UserService} from "../../service/user.service";
import {CommentsService} from "../../service/comments.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {PostService} from "../../service/post.service";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{

  isPostLoaded = false;
  //@ts-ignore
  posts: Post[];
  //@ts-ignore
  user: User;
  isUserDataLoaded = false;
  constructor(
    private postService: PostService,
    private userService: UserService,
    private commentService: CommentsService,
    private notificationService: NotificationService,
    private imageService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.postService.getAllPost()
      .subscribe(data=>{
        console.log(data);
        this.posts = data;
        this.getImageToPost(this.posts);
        this.getCommentsToPost(this.posts);
        this.isPostLoaded = true;
      });
    this.userService.getCurrentUser()
      .subscribe(data=>{
        this.user = data;
        this.isUserDataLoaded = true;
      })
  }

  getImageToPost(posts: Post[]): void{
    posts.forEach(p=>{
      if (p.id != null) {
        this.imageService.getImageToPost(p.id)
          .subscribe(data => {
            p.image = data.imageByte;
          })
      }
    });
  }

  getCommentsToPost(posts: Post[]):void{
    posts.forEach(p=>{
      if(p.id!= null) {
        this.commentService.getCommentToPost(p.id)
          .subscribe(data=>{
            p.comments = data;
          })}
      });
  }

  likePost(postId: number | undefined, postIndex: number):void{
    const post = this.posts[postIndex];
    console.log(post);

    if(!post.usersLiked?.includes(this.user.username)){
      if (postId != null) {
        this.postService.likePost(postId, this.user.username)
          .subscribe(() => {
            if (post.usersLiked != null) {
              post.usersLiked.push(this.user.username);
              this.notificationService.showSnackBar('Liked!');
            }
          });
      }
    }else {
      if (postId != null) {
        this.postService.likePost(postId, this.user.username)
          .subscribe(() => {
            if (post.usersLiked != null) {
              const index = post.usersLiked.indexOf(this.user.username, 0);
              if (index > -1) {
                post.usersLiked?.splice(index, 1);
              }
            }
          });
      }
    }
  }

  postComment(message: string, postId: number | undefined, postIndex: number){
    const post = this.posts[postIndex];
    console.log(post);
    if (postId != null) {
      this.commentService.addToCommentToPost(postId, message)
        .subscribe(data => {
          console.log(data);
          post.comments?.push(data)
        });
    }
  }

  formatImage(img: any): any {
    console.log(img)
    if (img == null) {
      return null;
    }

    return 'data:image/jpeg;base64,' + img;
  }
}
