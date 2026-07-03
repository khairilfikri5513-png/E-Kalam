import re

with open("src/components/MediaAvatar.tsx", "r") as f:
    content = f.read()

# Replace <video ... autoPlay muted loop ...> with <video ... controls ...>
pattern = re.compile(
    r'<video\n\s*src=\{src\}\n\s*autoPlay\n\s*muted\n\s*loop\n\s*playsInline\n\s*className=\{className\}\n\s*>'
)

replacement = """<video
        src={src}
        controls
        playsInline
        preload="metadata"
        className={className}
      >"""

content = pattern.sub(replacement, content)

with open("src/components/MediaAvatar.tsx", "w") as f:
    f.write(content)
