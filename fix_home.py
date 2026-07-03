with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

# I will just add `avatar?: string` to the array type or remove it.
# Easier to remove it from the JSX since it's not needed anymore.
# Or wait, do other cards have avatar? No, only AI Pembimbing had it!
# So we can remove the conditional logic.
old_jsx = """                {/* Arrow Button or Avatar */}
                {card.avatar ? (
                  <div className="w-16 h-16 relative flex-shrink-0 -mr-2">
                    {assetsLoading ? <Skeleton className="w-full h-full rounded-full" /> : <MediaAvatar src={card.avatar} alt="Muallim Khairil" className="w-full h-full object-contain rounded-full" />}
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-sm border border-white/30 group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                )}"""

new_jsx = """                {/* Arrow Button */}
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-sm border border-white/30 group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" strokeWidth={3} />
                </div>"""

content = content.replace(old_jsx, new_jsx)

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)

