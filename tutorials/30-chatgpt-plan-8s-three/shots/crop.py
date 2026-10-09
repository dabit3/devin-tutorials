from PIL import Image; import numpy as np
S='30-chatgpt-plan/shots/'; O='30-chatgpt-plan-8s-three/shots/'
def bbox(a,x0,y0,x1,y1,th=245):
    r=a[y0:y1,x0:x1].min(axis=2)
    ys,xs=np.where(r<th); return x0+xs.min(),y0+ys.min(),x0+xs.max()+1,y0+ys.max()+1
def cols_gap(a,x0,y0,x1,y1,th=250):
    r=a[y0:y1,x0:x1,:3].min(axis=2); dark=(r<th).any(axis=0)
    best=(0,0);s=None
    for i,d in enumerate(list(dark)+[True]):
        if not d and s is None: s=i
        if d and s is not None:
            if i-s>best[1]-best[0]: best=(s,i)
            s=None
    return x0+best[0],x0+best[1]
P=105; TW=2240; M=12
def padw(c): 
    h,w,_=c.shape; out=np.full((h+2*P,w+2*P,3),255,np.uint8); out[P:P+h,P:P+w]=c; return out
def rowcrop(src,y0,y1,name,ref=None):
    a=np.asarray(Image.open(S+src).convert('RGB'))
    r=np.asarray(Image.open(S+(ref or src)).convert('RGB'))
    bx0,by0,bx1,by1=bbox(r,880,y0,3450,y1)
    g0,g1=cols_gap(r,bx0,by0,bx1,by1)
    t,b=by0-M,by1+M
    left=a[t:b, bx0:g0]; right=a[t:b, g1:bx1]
    gap=TW-left.shape[1]-right.shape[1]; strip=a[t:b, g0:g0+gap]
    c=np.concatenate([left,strip,right],1); c[c.min(axis=2)>=250]=255
    print(name,'srcbox',(bx0,by0,bx1,by1),'stripmin',strip.min(),'right@',P+left.shape[1]+gap,'top src y',t, 'size', c.shape[1]+2*P, c.shape[0]+2*P)
    Image.fromarray(padw(c)).save(O+name)
rowcrop('0003.png',1680,1905,'link.png')
for f,n in (('0000.png','switch-off.png'),('0003.png','switch-on.png')): rowcrop(f,1905,2150,n,'0003.png')
a=np.asarray(Image.open(S+'0007.png').convert('RGB'))
bx0,by0,bx1,by1=bbox(a,2985,1215,4000,1500); print('hover',bx0,by0,bx1,by1)
c=a[by0-M:by1+M,bx0-M:bx1+M].copy(); c[c.min(axis=2)>=240]=255
Image.fromarray(padw(c)).save(O+'hover-on.png'); print('hover size',c.shape[1]+2*P,c.shape[0]+2*P,'origin',bx0-M-P,by0-M-P)
