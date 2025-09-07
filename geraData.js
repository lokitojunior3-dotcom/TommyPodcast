
import fs from "fs";
import fetch from "node-fetch";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const { apiKey, channelId } = config;

async function gerarData() {
  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();
    const channel = channelData.items[0].snippet;

    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=4&order=date&type=video&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    const videos = videosData.items.map(v => ({
      id: v.id.videoId,
      title: v.snippet.title,
      description: v.snippet.description,
      thumbnail: v.snippet.thumbnails.high.url
    }));

    const data = {
      channelId,
      channelName: channel.title,
      channelLogo: channel.thumbnails.default.url,
      videos
    };

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ data.json atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao gerar data.json:", err);
  }
}

gerarData();
