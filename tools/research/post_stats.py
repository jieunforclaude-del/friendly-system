import re,sys,html,collections,os,subprocess
P=sys.argv[1]; UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
for u in sys.argv[2:]:
    bid,no=re.search(r'naver\.com/([^/]+)/(\d+)',u).groups(); out=f"{P}/{bid}_{no}.html"
    if not os.path.exists(out): subprocess.run(['curl','-sS','-A',UA,'-o',out,f'https://m.blog.naver.com/PostView.naver?blogId={bid}&logNo={no}'])
    h=open(out,encoding='utf-8',errors='ignore').read()
    t=re.search(r'<meta property="og:title" content="([^"]*)"',h); title=html.unescape(t.group(1)) if t else '?'
    b=h[h.find('se-main-container'):]
    for e in ('post_footer','wrap_postdata','se_viewArea_bottom'):
        if e in b: b=b[:b.find(e)]; break
    b=re.sub(r'<script.*?</script>|<style.*?</style>','',b,flags=re.S)
    txt=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',b)))
    links=[html.unescape(l) for l in re.findall(r'href="(https?://[^"]+)"',b)]
    dom=collections.Counter(re.sub(r'^https?://([^/]+).*',r'\1',l) for l in links if not re.search(r'pstatic|naver\.(com|net)',l))
    places=re.findall(r'<strong class="se-map-title">(.*?)</strong>|se-map-title[^>]*>\s*([^<]+)<',b)
    places=[html.unescape((a or c).strip()) for a,c in places]
    print(f"[{bid}] {title}\n  chars(nospace)={len(re.sub(r'\s','',txt))} imgs={len(re.findall(r'se-component se-image',b))} groups={len(re.findall(r'se-component se-imageGroup|se-imageStrip',b))} maps={len(re.findall(r'se-component se-placesMap|se-component se-map',b))} tables={len(re.findall(r'se-component se-table',b))} video={len(re.findall(r'se-component se-video',b))} oglink={len(re.findall(r'se-component se-oglink',b))}\n  places={places[:4]}\n  links={dict(dom.most_common(6))}\n  disclose={[m.group(0) for m in re.finditer(r'.{0,25}(수수료|소정의|제휴|원고료|협찬|지원받|제공받|내돈내산|체험단).{0,25}',txt)][:2]}\n  head: {txt[:220]}\n")
