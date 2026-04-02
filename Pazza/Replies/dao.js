import model from "../Posts/model.js";
import ReplyModel from "./model.js";
import { v4 as uuidv4 } from "uuid";
export default function ReplyDao() {
    async function createReplyToFollowup(postId, followupId, userId, reply) {
        const post = await model.findById(postId);
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");
        const newReply = { ...reply, _id: uuidv4(), author: userId };
        const createdReply = await ReplyModel.create(newReply);
        followup.replies.push(createdReply);

        await post.save();

        return createdReply;
    }
    async function createReplyToReply(
        postId,
        followupId,
        parentReplyId,
        userId,
        newReply
    ) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const parentReply = followup.replies.id(parentReplyId);
        if (!parentReply) throw new Error("Reply not found");

        const newReplyWithId = { ...newReply, _id: uuidv4(), author: userId };
        const createdReply = await ReplyModel.create(newReplyWithId);
        parentReply.replies.push(createdReply);
        console.log("Reply to reply", createdReply);
        console.log("Post", post);
        await post.save();

        return createdReply;
    }
    async function editReplyToFollowup(
        postId,
        followupId,
        replyId,
        userId,
        replyUpdates
    ) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const reply = followup.replies.id(replyId);
        if (!reply) throw new Error("Reply not found");

        Object.assign(reply, replyUpdates, {
            author: userId,
            timestamp: Date.now(),
        });
        await post.save();
        return reply;
    }

    async function editReplyToReply(
        postId,
        followupId,
        parentReplyId,
        replyId,
        userId,
        replyUpdates
    ) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const parentReply = followup.replies.id(parentReplyId);
        if (!parentReply) throw new Error("Parent reply not found");

        const reply = parentReply.replies.id(replyId);
        if (!reply) throw new Error("Reply-to-reply not found");

        Object.assign(reply, replyUpdates, {
            author: userId,
            timestamp: Date.now(),
        });
        await post.save();
        return reply;
    }

    async function deleteReplyToFollowup(postId, followupId, replyId) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");

        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const reply = followup.replies.id(replyId);
        if (!reply) throw new Error("Reply not found");

        reply.deleteOne();
        await post.save();

        return { message: "Reply deleted successfully" };
    }

    async function deleteReplyToReply(
        postId,
        followupId,
        parentReplyId,
        replyId,
    ) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");

        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const parentReply = followup.replies.id(parentReplyId);
        if (!parentReply) throw new Error("Parent reply not found");

        const reply = parentReply.replies.id(replyId);
        if (!reply) throw new Error("Reply-to-reply not found");

        reply.deleteOne();
        await post.save();

        return { message: "Reply-to-reply deleted successfully" };
    }

    return {
        createReplyToFollowup,
        createReplyToReply,
        editReplyToFollowup,
        editReplyToReply,
        deleteReplyToFollowup,
        deleteReplyToReply
    };
}
