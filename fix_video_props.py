with open("src/components/VideoWithAudioCheck.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "interface VideoWithAudioCheckProps extends React.VideoHTMLAttributes<HTMLVideoElement> {}",
    "interface VideoWithAudioCheckProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {}"
)

with open("src/components/VideoWithAudioCheck.tsx", "w") as f:
    f.write(content)
