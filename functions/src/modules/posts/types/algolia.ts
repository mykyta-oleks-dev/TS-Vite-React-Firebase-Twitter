import { Post } from "../../../shared/types/data/Post";

export type AlgoliaPost = Pick<Post, 'id' | 'content' | 'title' | 'userId'>
