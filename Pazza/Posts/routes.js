import PostsDao from "./dao.js";

export default function PostRoutes(app) {
    const dao = PostsDao();

    const getAllPostsForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = req.session["currentUser"]?._id;
            if (!userId) {
                res.sendStatus(401)
            }
            const posts = await dao.getAllPostsForCourse(courseId, userId);
            res.json(posts);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    };

    const getPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id
            await dao.readPost(postId, userId)
            const post = await dao.getPost(postId);
            res.json(post);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    };

    const createPost = async (req, res) => {
        try {
            const userId = req.session["currentUser"]?._id;
            if (!userId) {
                return res.status(401).json({ error: "User not found" });
            }
            const newPost = req.body;
            const newPostWithUserId = { ...newPost, author: userId, folder: newPost.folder.name };
            const response = await dao.createPost(newPostWithUserId);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const editPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const postUpdates = req.body;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const post = await dao.editPost(postId, postUpdates, userId);
            res.json(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const deletePost = async (req, res) => {
        const { postId } = req.params;
        try {
            const result = await dao.deletePost(postId);
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ message: "Post deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const readPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const response = await dao.readPost(postId, userId);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    app.put("/api/pazza/posts/:postId/views", readPost);
    app.get("/api/pazza/posts/:postId", getPost);
    app.put("/api/pazza/posts/:postId", editPost);
    app.delete("/api/pazza/posts/:postId", deletePost);
    app.post("/api/pazza/posts", createPost);
    app.get("/api/pazza/:courseId/posts", getAllPostsForCourse);
}
