import { TVideosDB } from "../types"; 
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos"

    public async findVideos (q: string | undefined) {
        let videosDB

        if (q) {
            const result: TVideosDB[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS)
                .where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: TVideosDB[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS)
            videosDB = result
        }

        return videosDB
    }

    public async findVideoById(id: string) {
        const [ videoDB ]: TVideosDB[] | undefined[] = 
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where({ id })

        return videoDB
    }

    public async insertVideo(newVideoDB: TVideosDB) {
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .insert(newVideoDB)
    }

    public async updateVideo(editedVideoDB: TVideosDB, id: string) {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
            .update(editedVideoDB)
            .where({ id })
    }
    
    public async deleteVideo(id: string) {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
            .del()
            .where({ id })
    }
}
