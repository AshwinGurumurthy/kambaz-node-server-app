import FollowupDao from "./dao.js";

export default function FollowupRoutes(app) {
    const dao = FollowupDao();

    const createFollowupToPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const followup = req.body;
            const response = await dao.createFollowupToPost(
                postId,
                userId,
                followup
            );
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const editFollowup = async (req, res) => {
        try {
            const { postId, followupId } = req.params;
            const followupUpdates = req.body;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const followup = await dao.editFollowup(
                postId,
                userId,
                followupId,
                followupUpdates
            );
            res.json(followup);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };
    const deleteFollowup = async (req, res) => {
        try {
            const { postId, followupId } = req.params;
            const userId = req.session["currentUser"]._id;

            if (userId === null) {
                res.status(401).json({ error: "User not found" });
                return;
            }

            const response = await dao.deleteFollowup(
                postId,
                followupId
            );

            res.json(response);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };

    app.delete("/api/pazza/posts/:postId/followup/:followupId",deleteFollowup);
    app.put("/api/pazza/posts/:postId/followup/:followupId", editFollowup);
    app.post("/api/pazza/posts/:postId/followup", createFollowupToPost);
}
