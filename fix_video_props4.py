with open("src/components/VideoWithAudioCheck.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "interface VideoWithAudioCheckProps extends React.ComponentProps<\"video\"> {}",
    "interface VideoWithAudioCheckProps { [key: string]: any }"
)

with open("src/components/VideoWithAudioCheck.tsx", "w") as f:
    f.write(content)
