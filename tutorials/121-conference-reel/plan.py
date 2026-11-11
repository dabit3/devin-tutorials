import json, os
# Generates sections.json from the clip timestamps in footage-manifest.md.
CROP=[360,321,3120]
# name, title, prompt_start, conv, comp, viewer_open, viewer_close, art, summary, extra
S=[
 ("01-brewbot","Devin designing and testing three landing pages",0,7,19,46,75,76,105,{}),
 ("02-kanban-qa","Devin running exploratory QA on a Kanban app",1,7,23,51,80,81,130,{}),
 ("03-solar-system","Devin building and testing a 3D solar system",1,7,26,53,82,84,117,{}),
 ("04-expo-mobile-apps","Devin building and testing three Expo mobile apps",0,7,26,59,88,89,107,{}),
 ("05-neon-breakout","Devin building and playtesting a Breakout game",1,7,23,50,72,73,93,{}),
 ("06-orbit-confetti","Devin shipping a feature PR and testing it",1,7,19,47,76,77,95,{}),
 ("07-architecture-map","Devin mapping a codebase's architecture",0,7,None,None,None,19,86,{}),
 ("08-earthquake-globe","Devin building and testing an earthquake globe",0,7,26,53,82,84,121,{}),
 ("09-devin-arcade","Devin and three child sessions building an arcade",0,6,41,74,96,98,121,{"agents":(28,41)}),
 ("10-drum-machine","Devin building and testing a drum machine",1,7,19,53,82,83,115,{}),
]
CONV=3.0; COMP=3.0; ART=2.0; ARTMAX=15
secs=[]; total=0
for n,t,p,c,comp,vo,vc,a,s,x in S:
    src=n+".mp4"; parts=[]
    parts.append(dict(src=src,**{"in":p+0.3,"dur":5.0}))
    end_conv = x.get("agents",(comp,))[0] if comp else a
    parts.append(dict(src=src,**{"in":c,"dur":round((end_conv-c)/CONV,2),"speed":CONV}))
    if "agents" in x:
        ag=x["agents"]; parts.append(dict(src=src,**{"in":ag[0],"dur":round((ag[1]-ag[0])/1.5,2),"speed":1.5}))
    if comp is not None:
        parts.append(dict(src=src,**{"in":comp+1,"dur":round((vo-comp-1)/COMP,2),"speed":COMP}))
        parts.append(dict(src=src,**{"in":vo+1.5,"dur":round(vc-vo-1.5,2),"crop":CROP,"tag":True}))
        ad=min((s-a)/ART,ARTMAX)
        parts.append(dict(src=src,**{"in":a+0.5,"dur":round(ad,2),"speed":ART}))
    else:
        parts.append(dict(src=src,**{"in":a,"dur":round((s-a)/1.75,2),"speed":1.75}))
    d=sum(q["dur"] for q in parts)-0.6*(len(parts)-1)
    total+=d; print(n,round(d,1))
    secs.append(dict(title=t,parts=parts))
ios="11-native-ios.mp4"
ip=[dict(src=ios,**{"in":1.3,"dur":5.0}),
 dict(src=ios,**{"in":7,"dur":round(26/3,2),"speed":3}),
 dict(src=ios,**{"in":34,"dur":13.5,"speed":2}),
 dict(src=ios,**{"in":62.5,"dur":27.5,"crop":CROP,"tag":True}),
 dict(src=ios,**{"in":95,"dur":9}),
 dict(src=ios,**{"in":104,"dur":9.33,"speed":1.5}),
 dict(src=ios,**{"in":118,"dur":7,"speed":2})]
d=sum(q["dur"] for q in ip)-0.6*(len(ip)-1); total+=d; print("11-native-ios",round(d,1))
secs.insert(0,dict(title="Devin building and testing a native iOS app",parts=ip))
print("total",round(total,1))
spec=dict(output="121-conference-reel.mp4",open="What Devin can build and test",close="devin.ai",testTag="Devin's test recording",sections=secs)
json.dump(spec,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"sections.json"),"w"),indent=1)
