import {Comments} from './Comments';
export interface Post{
  id?: number;
  title: string;
  caption: string;
  location: string;
  image?: File;
  likes?: number;
  usersLiked?: string [];
  comments?: Comments [];
  username?: string;
}
