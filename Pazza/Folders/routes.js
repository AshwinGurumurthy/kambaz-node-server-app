import PazzaFolderDao from "./dao.js";

export default function PazzaFolderRoutes(app) {
    const dao = PazzaFolderDao();
    const findFoldersForCourse = async (req, res) => {
        const { courseId } = req.params;
        const folders = await dao.findFoldersForCourse(courseId)
        res.json(folders)
    }
    const createFolderForCourse = async (req, res) => {
        const { courseId } = req.params;
        const folderData = req.body
        try {
            const status = await dao.createFolder(courseId, folderData)
            res.json(status)
        } catch (e) {
            console.log(e)
            res.status(400).json({
                "status": "failed",
                "message": e.errorResponse
            })
        }
    }
    const updateFolderName = async (req, res) => {
        const { folderId } = req.params
        const folderName = req.body.name
        try {
            const status = await dao.updateFolderName(folderId, folderName)
            res.json(status)
        } catch (e) {
            console.log(e)
            res.status(400).json({
                "status": "failed",
                "message": e.errorResponse
            })
        }
    }
    const deleteFolders = async (req, res) => {
        const { courseId } = req.params
        const folderNames = req.body
        const status = await dao.deleteFolders(courseId, folderNames)
        console.log("delete",status);
        return res.status(200).json(status);
    }

    const getPostsBasedOnFolderFilter = async (req, res) => {
        try {
            const { folderId } = req.params;
            const userId = req.session["currentUser"]?._id;
            if (!userId) {
                return res.status(401).json({ error: "User not found" });
            }
            const posts = await dao.findPostsBasedOnFolderFilter(folderId, userId);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    const getAllFolders = async (req, res) => {
        const folders = await dao.getAllFolders();
        res.json(folders);
    }

    app.put("/api/pazza/:courseId/folders/:folderId", updateFolderName)
    
    app.post("/api/pazza/:courseId/folders", createFolderForCourse)
    app.get("/api/pazza/:courseId/folders", findFoldersForCourse)
    app.delete("/api/pazza/:courseId/folders/delete", deleteFolders)
    app.get("/api/pazza/:courseId/folders/:folderId", getPostsBasedOnFolderFilter)
    app.get("/api/pazza/folders", getAllFolders)
};
