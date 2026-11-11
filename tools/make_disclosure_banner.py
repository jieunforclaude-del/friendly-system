from PIL import Image, ImageDraw, ImageFont
import sys
F = sys.argv[2] if len(sys.argv) > 2 else 'Pretendard-'  # Pretendard 폰트 경로 접두어 (npm pack pretendard)
OUT = sys.argv[1]

W, H = 1600, 220
TEAL = (33, 184, 209)
DARK = (70, 74, 82)
BG = (246, 248, 250)

def seg_draw(d, y, parts, font_r, font_b):
    # parts: list of (text, bold, color)
    widths = [d.textlength(t, font=font_b if b else font_r) for t, b, c in parts]
    x = (W - sum(widths)) / 2
    for (t, b, c), w in zip(parts, widths):
        d.text((x, y), t, font=font_b if b else font_r, fill=c)
        x += w

def make(path, bg=True):
    im = Image.new('RGB', (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    if bg:
        d.rounded_rectangle((8, 8, W - 8, H - 8), radius=28, fill=BG)
        d.rounded_rectangle((44, 52, 52, H - 52), radius=4, fill=TEAL)
    r = ImageFont.truetype(F + 'Regular.otf', 44)
    b = ImageFont.truetype(F + 'Bold.otf', 44)
    seg_draw(d, 50, [('세시간전 크리에이터 활동을 통해 ', False, DARK), ('수익이 발생하는 링크', True, TEAL), ('가 포함되어 있습니다.', False, DARK)], r, b)
    seg_draw(d, 118, [('해당 링크를 통해 상품을 구매할 경우 ', False, DARK), ('수수료가 지급됩니다.', True, TEAL)], r, b)
    im.save(path)
    print(path, im.size, round(W / H, 2))

make(OUT)
