import { v4 as uuidv4 } from "uuid";
import FollowupModel from "./model.js";
import UserModel from "../../Kambaz/Users/model.js";
import model from "../Posts/model.js";

export default function FollowupDao() {
    async function createFollowupToPost(postId, userId, followup) {
        const post = await model.findById(postId);
        const newFollowup = { ...followup, _id: uuidv4(), author: userId };
        const createdFollowup = await FollowupModel.create(newFollowup);
        post.follow_ups.push(createdFollowup);
        await post.save();
        return createdFollowup;
    }
    async function editFollowup(postId, userId, followupId, followupUpdates) {
        const post = await model.findById(postId);
        const followup = post.follow_ups.id(followupId);

        Object.assign(followup, followupUpdates, {
            updated_by: userId,
            timestamp: Date.now(),
        });
        await post.save();
        console.log("followup edited", followup);
        return followup;
    }

    async function deleteFollowup(postId, followupId) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");

        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        followup.deleteOne();
        await post.save();

        console.log("followup deleted", followupId);
        return { message: "Followup deleted successfully" };
    }

    return {
        createFollowupToPost,
        editFollowup,
        deleteFollowup,
    };
}
