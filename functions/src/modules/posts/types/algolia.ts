import { Post } from "../../../shared/types/data/Post.js";

export type AlgoliaPost = Pick<Post, 'id' | 'content' | 'title' | 'userId'>
