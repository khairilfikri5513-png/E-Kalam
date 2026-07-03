with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.strip() == "useEffect(() => {":
        if i + 1 < len(lines) and "setLoadingHistory(true);" in lines[i+1]:
            # This is the broken useEffect body
            new_lines.append(line)
            skip = True
            continue
    
    if skip:
        if line.strip() == "};" and "const checkUserAndFetchAvatar" in lines[i+2]:
            skip = False
            continue
        continue
    
    new_lines.append(line)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.writelines(new_lines)
