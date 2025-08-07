//req to backend and take res from backend
//use like go any page an use method


import { IVideo } from "@/models/Videos";

//make type for videoFormData
export type videoFormData = Omit<IVideo , "_id">


type FatchOptions = {
    method? : "GET" | "POST" | "PUT" | "DELETE";
    body? : any;
    headers? : Record<string , string>
}

class ApiClient {

    //make custmize private method to fetch req to backend

    private async fetch<T>(
        endpoint : string,
        options : FatchOptions = {}
    ) : Promise<T> {

        const {method = "GET" , body , headers = {}} = options;

        const defaultHeaders = {
            "Content-Type" : "application/json",
            ...headers
        }

        const response = await fetch(`api/${endpoint}` , {

            method,
            headers : defaultHeaders,
            body : body ? JSON.stringify(body) : undefined

        })

        if(!response.ok) {
            throw new Error(await response.text())
        }

        return response.json()

    }

    //----------------------------

    //get all videos
    async getVideos() {
        return this.fetch("/videos")
    }

    async createVideo(VideoData : videoFormData) {
        return this.fetch("/videos" , {
            method : "POST",
            body : VideoData
        })
    }
}

export const apiClient = new ApiClient();