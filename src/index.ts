import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { TVideosDB } from "./types";
import { Video } from "./classes/video";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q;

    let videosDB;

    if (q) {
      const result: TVideosDB[] = await db("videos").where(
        "title",
        "LIKE",
        `%${q}%`
      );
      videosDB = result;
    } else {
      const result: TVideosDB[] = await db("videos");
      videosDB = result;
    }

    const videos: Video[] = videosDB.map(
      (videoDB) =>
        new Video(
          videoDB.id,
          videoDB.title,
          videoDB.video_length,
          videoDB.uploaded_at
        )
    );

    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, video_length, uploaded_at } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' deve ser string");
    }

    if (typeof video_length !== "number") {
      res.status(400);
      throw new Error("'video_length' deve ser string");
    }

    if (typeof uploaded_at !== "string") {
      res.status(400);
      throw new Error("'uploaded_at' deve ser string");
    }

    const [videoDBExists]: TVideosDB[] | undefined[] = await db("videos").where(
      { id }
    );

    if (videoDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newVideo = new Video(
      id,
      title,
      video_length,
      new Date().toISOString()
    );

    const newVideoDB: TVideosDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      video_length: newVideo.getVideoLength(),
      uploaded_at: newVideo.getUploadedAt(),
    };

    await db("videos").insert(newVideoDB);

    res.status(200).send({
      message: "Vídeo criado com sucesso",
      video: newVideo,
    });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const paramsId = req.params.id;

    const newId = req.body.id;
    const newTitle = req.body.title;
    const newVideoLength = req.body.video_length;

    const [selectedVideo]: TVideosDB[] | undefined[] = await db("videos").where(
      { id: paramsId }
    );

    if (!selectedVideo) {
      res.status(400);
      throw new Error("Esse vídeo não existe");
    } else if (selectedVideo) {
      if (typeof newTitle !== "string" && typeof newTitle !== undefined) {
        res.status(400);
        throw new Error("Tipo de Title inválido");
      }
      if (newTitle.length < 2) {
        res.status(400);
        throw new Error("'Title' deve ter pelo menos 2 caracteres");
      }
      if (
        typeof newVideoLength !== "number" &&
        typeof newVideoLength !== undefined
      ) {
        res.status(400);
        throw new Error("Tipo de videoLength inválido");
      }
      if (newVideoLength < 30) {
        res.status(400);
        throw new Error("O tempo de vídeo não pode ser inferior a 30 segundos");
      }

      const editedVideo = new Video(
        newId,
        newTitle,
        newVideoLength,
        new Date().toISOString()
      );

      const editedVideoDB: TVideosDB = {
        id: editedVideo.getId() || selectedVideo.id,
        title: editedVideo.getTitle() || selectedVideo.title,
        video_length: editedVideo.getVideoLength() || selectedVideo.video_length,
        uploaded_at: editedVideo.getUploadedAt() || selectedVideo.uploaded_at,
      };

      await db("videos").update(editedVideoDB).where({ id: paramsId });

      res.status(200).send({
        message: "Vídeo editado com sucesso!",
        Video: editedVideoDB,
      });
    }
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const videoToDelete: TVideosDB[] | undefined[] = await db("videos").where({id})

    if(!videoToDelete) {
      res.status(404)
      throw new Error("Esse vídeo não existe no banco de dados");
    }

    await db("videos").del().where({id})

    res.status(200).send(`Vídeo de id '${id}' deletado com sucesso`)

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
