import {Component, OnInit} from '@angular/core';
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {CommentsService} from "../../service/comments.service";
import {NotificationService} from "../../service/notification.service";
import {Post} from "../../models/Post";

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css']
})
export class UserPostComponent implements OnInit{

  isUserPostLoaded = false;
  //@ts-ignore
  posts: Post[];
  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private commentService: CommentsService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
      .subscribe(data=>{
        console.log(data);
        this.posts =data;
        this.getImageToPost(this.posts);
        this.getCommentsToPost(this.posts);
        this.isUserPostLoaded = true;
      });
  }

  getImageToPost(posts: Post[]){
    posts.forEach(p=>{
      if (p.id != null) {
        this.imageService.getImageToPost(p.id)
          .subscribe(data => {
            p.image = data.imageByte;
          });
      }
    });
  }

  getCommentsToPost(posts: Post[]){
    posts.forEach(p=>{
      if (p.id != null) {
        this.commentService.getCommentToPost(p.id)
          .subscribe(data => {
            p.comments = data;
          });
      }
    });
  }
  removePost(post: Post, index: number){
    console.log(post);
    const result = confirm('Do you really want to delete this post?');
    if(result){
      if (post.id != null) {
        this.postService.delete(post.id)
          .subscribe(() => {
            this.posts.splice(index, 1);
            this.notificationService.showSnackBar('Post deleted');
          });
      }
    }
  }
  formatImage(img: any): any {
    console.log(img)
    if (img == null) {
      return null;
    }

    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number | undefined, postIndex: number, commentIndex: number){
    const post = this.posts[postIndex];

    if (commentId != null) {
      this.commentService.delete(commentId)
        .subscribe(data => {
          this.notificationService.showSnackBar('Comment removed');
          post.comments?.splice(commentIndex, 1);
        });
    }
  }

}
