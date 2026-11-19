"""Generate PNG icons and optional promo asset for Chrome Web Store with Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"store-assets"
OUT.mkdir(exist_ok=True)
def icon(size,padding=.125):
    S=512
    im=Image.new("RGBA",(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    p=int(S*padding)
    d.rounded_rectangle((p,p,S-p,S-p),radius=92,fill="#071a3c")
    d.polygon([(256,100),(390,158),(380,315),(256,429),(132,315),(122,158)],fill="#12b8f6")
    d.polygon([(256,125),(365,174),(356,300),(256,395),(156,300),(147,174)],fill="#0a2856")
    d.polygon([(184,208),(184,282),(244,245)],fill="white")
    d.polygon([(244,208),(244,282),(304,245)],fill="white")
    d.rounded_rectangle((310,204,324,286),radius=7,fill="white")
    d.ellipse((218,298,294,374),fill="#10baf3")
    d.ellipse((225,305,287,367),fill="#0a2856")
    d.polygon([(238,329),(247,329),(261,317),(261,354),(247,342),(238,342)],fill="white")
    d.line((232,355,277,311),fill="#15c6fa",width=9)
    return im.resize((size,size),Image.Resampling.LANCZOS)
for size in (16,32,48,128):
    icon(size,0 if size<48 else .125).save(ROOT/"extension"/f"icon-{size}.png")
icon(128).save(OUT/"store-icon-128.png")
promo=Image.new("RGB",(440,280),"#071a3c"); d=ImageDraw.Draw(promo)
for y in range(280):
    d.line((0,y,440,y),fill=(7,20+int(14*y/280),60+int(15*y/280)))
brand=icon(200,0)
promo.paste(brand,(19,40),brand)
try:
    font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",29)
    small=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",16)
except OSError:
    font=ImageFont.load_default(); small=font
d.text((208,68),"Universal",fill="white",font=font)
d.text((208,103),"Ad Skip",fill="#36d6ff",font=font)
d.text((210,161),"Skip  |  Close",fill="white",font=small)
d.text((210,189),"Mute  |  Rules",fill="#aed7f9",font=small)
promo.save(OUT/"small-promo-440x280.png")
print("Assets generated")
