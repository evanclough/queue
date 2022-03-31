import youtube_dl

def get_duration(ID):
    with youtube_dl.YoutubeDL({}) as dl:
        dictMeta = dl.extract_info(f"https://www.youtube.com/watch?v={ID}", download=False)
    return dictMeta['duration']