import re,sys,html,os,subprocess
P=sys.argv[1]; UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
KW=r'(\d[\d,]*\s?만?\s?원|주소|📍|서울|경기|시간|24시|영업|주차|수면|한증막|불가마|황토|노천|세신|식당|가운|수건|휴무|입장|요금|시간당)'
for spec in sys.argv[2:]:
    bid,no=spec.split('/'); out=f"{P}/{bid}_{no}.html"
    if not os.path.exists(out): subprocess.run(['curl','-sS','-A',UA,'-o',out,f'https://m.blog.naver.com/PostView.naver?blogId={bid}&logNo={no}'])
    h=open(out,encoding='utf-8',errors='ignore').read()
    t=re.search(r'<meta property="og:title" content="([^"]*)"',h)
    d=re.search(r'"(?:publishDate|addDate)"\s*:\s*"?([^",]+)',h) or re.search(r'class="blog_date"[^>]*>([^<]+)',h)
    b=h[h.find('se-main-container'):]
    for e in ('post_footer','wrap_postdata','se_viewArea_bottom'):
        if e in b: b=b[:b.find(e)]; break
    b=re.sub(r'<script.*?</script>|<style.*?</style>','',b,flags=re.S)
    txt=re.sub(r'[\s​]+',' ',html.unescape(re.sub(r'<[^>]+>',' ',b)))
    txt=txt.replace('이 블로그의 체크인 이 장소의 다른 글','')
    sents=re.split(r'(?<=[.!?~])\s+|\s{2,}',txt)
    hits=[s.strip()[:160] for s in sents if re.search(KW,s)]
    print(f"### {bid} | {html.unescape(t.group(1)) if t else '?'} | {d.group(1) if d else ''}")
    for s in list(dict.fromkeys(hits))[:16]: print('  -',s)
