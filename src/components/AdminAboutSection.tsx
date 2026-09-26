import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { ABOUT_FIELDS } from '../data/aboutDefaults';
import { AboutDocument } from '../lib/aboutContent';
import { ImagePickerModal } from './ImagePickerModal';

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const Field: React.FC<{label:string;value:string;onChange:(v:string)=>void}> = ({label,value,onChange}) => {
  return <label className="block text-sm font-semibold text-slate-700">{label}<textarea aria-label={label} className="block w-full mt-1 p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm" rows={value.length>120?4:2} value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
export const AdminAboutSection: React.FC<{onShowToast:(message:string)=>void}> = ({onShowToast}) => {
  const content = useContent();
  if (!content.aboutReady) return <div className="p-6 rounded-2xl bg-white"><p role="status">{content.aboutError || 'Đang tải About Us từ máy chủ…'}</p><button className="mt-4 underline" onClick={()=>void content.refreshAbout()}>Tải lại About Us</button></div>;
  return <AboutEditor onShowToast={onShowToast}/>;
};
function AboutEditor({onShowToast}:{onShowToast:(message:string)=>void}) {
  const content=useContent();
  const snapshot=():AboutDocument=>clone({aboutInfo:{...content.aboutInfo,heroImageUrl:content.aboutInfo.heroImageUrl??content.branding.aboutHeroImageUrl??'/images/hoki-greener-tomorrow-hero.svg',factoryImageUrl:content.aboutInfo.factoryImageUrl??content.branding.aboutFactoryImageUrl??'/images/factory-alpha-hub.svg'},leadershipHeads:content.leadershipHeads,advisoryMembers:content.advisoryMembers});
  const [draft,setDraft]=useState(snapshot), [revision,setRevision]=useState(content.aboutRevision);
  const [dirty,setDirty]=useState(false), [busy,setBusy]=useState(false), [error,setError]=useState('');
  const [tab,setTab]=useState('Giới thiệu');
  const [picker,setPicker]=useState<{url:string;apply:(url:string)=>void}|null>(null);
  const lock=useRef(false);
  // Refresh clean forms, but never replace an unsaved draft with a background read.
  useEffect(()=>{if(!dirty&&!busy){setDraft(snapshot());setRevision(content.aboutRevision);}},[content.aboutInfo,content.leadershipHeads,content.advisoryMembers,content.aboutRevision,dirty,busy]);
  useEffect(()=>{
    if(!dirty)return;
    const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};
    window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);
  const change=(update:(next:AboutDocument)=>void)=>{setDraft(prev=>{const next=clone(prev);update(next);return next;});setDirty(true);setError('');};
  const setInfo=(key:string,value:any)=>change(next=>{next.aboutInfo[key]=value;});
  const save=async()=>{
    if(lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const saved=await content.saveAboutContent(draft,revision);setRevision(saved);setDirty(false);onShowToast('Đã lưu và kiểm tra toàn bộ About Us trên máy chủ.');}
    catch(e){setError((e as Error).message);}finally{setBusy(false);lock.current=false;}
  };
  const exportDraft=()=>{const data={...content.exportBackupData(),...draft,aboutInfo:{...draft.aboutInfo,aboutContentVersion:1}};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='hoki-about-draft-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const imageField=(label:string,url:string,apply:(url:string)=>void)=><div className="space-y-2"><Field label={label} value={url} onChange={apply}/>{url&&<img src={url} alt={label} className="w-28 h-24 object-cover rounded-xl"/>}<button type="button" className="text-green-800 underline text-sm" onClick={()=>setPicker({url,apply})}>Chọn / tải ảnh — {label}</button></div>;
  const staff=tab==='Lãnh đạo'?'leadershipHeads':'advisoryMembers';
  const labels:Record<string,string>={name:'Họ tên',department:'Bộ phận',title:'Chức danh',credentials:'Bằng cấp',focus:'Phụ trách',bio:'Tiểu sử',role:'Vai trò',specialization:'Chuyên môn',actionText:'Nội dung nút liên hệ'};
  return <div className="space-y-5 text-slate-800">
    <div className="sticky top-24 z-10 bg-white rounded-2xl border p-4 flex flex-wrap items-center gap-3 shadow-sm">
      <div className="flex-1"><h2 className="font-bold text-xl">About Us</h2><p className="text-sm">{dirty?'Có thay đổi chưa lưu.':'Nội dung đã tải từ máy chủ.'} Lưu một lần cho toàn bộ trang.</p></div>
      <button type="button" disabled={busy} className="px-4 py-2 border rounded-xl" onClick={exportDraft}>Xuất backup bản nháp</button>
      <button type="button" disabled={busy} className="px-5 py-3 rounded-xl bg-green-800 text-white disabled:opacity-50" onClick={()=>void save()}>{busy?'Đang lưu…':'Lưu toàn bộ About Us'}</button>
    </div>
    {error&&<p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800">{error}</p>}
    {content.aboutError&&<p role="alert" className="p-4 rounded-xl bg-amber-50">{content.aboutError} Bản nháp vẫn được giữ.</p>}
    {dirty&&revision!==content.aboutRevision&&<p role="alert" className="p-3 bg-amber-50">Có nội dung mới từ trình duyệt khác. Xuất backup bản nháp trước khi tải lại trang để đối chiếu.</p>}
    <nav aria-label="Các phần About Us" className="flex flex-wrap gap-2">{['Giới thiệu','Lãnh đạo','Foundation','Nhà máy','Chất lượng','Mạng lưới & cố vấn','Lịch sử công ty'].map(name=><button type="button" key={name} aria-pressed={tab===name} className={`px-4 py-2 rounded-full border ${tab===name?'bg-blue-900 text-white':'bg-white'}`} onClick={()=>setTab(name)}>{name}</button>)}</nav>
    <fieldset disabled={busy} className="bg-white p-5 sm:p-7 rounded-2xl border space-y-5 min-w-0">
      <legend className="font-bold text-lg px-2">{tab}</legend>
      {ABOUT_FIELDS.filter(f=>f.group===tab).map(f=><Field key={f.key} label={f.label} value={(f.nested?draft.aboutInfo.pageText[f.key]:draft.aboutInfo[f.key])??''} onChange={value=>change(next=>{if(f.nested)next.aboutInfo.pageText[f.key]=value;else next.aboutInfo[f.key]=value;})}/>)}
      {tab==='Giới thiệu'&&imageField('Ảnh giới thiệu',draft.aboutInfo.heroImageUrl??content.branding.aboutHeroImageUrl??'',url=>setInfo('heroImageUrl',url))}
      {tab==='Nhà máy'&&imageField('Ảnh nhà máy',draft.aboutInfo.factoryImageUrl??content.branding.aboutFactoryImageUrl??'',url=>setInfo('factoryImageUrl',url))}
      {(tab==='Lãnh đạo'||tab==='Mạng lưới & cố vấn')&&<section className="space-y-4">
        <h3 className="font-bold">{tab==='Lãnh đạo'?'Danh sách lãnh đạo':'Danh sách cố vấn'}</h3>
        {draft[staff].map((person,index)=><div key={person.id||index} className="p-5 rounded-xl bg-slate-50 border space-y-3">
          <h4 className="font-semibold">{index+1}. {person.name||'Nhân sự mới'}</h4>
          {(staff==='leadershipHeads'?['name','department','title','credentials','focus','bio']:['name','role','specialization','bio','actionText']).map(key=><Field key={key} label={`${labels[key]} ${index+1}`} value={person[key]??''} onChange={value=>change(next=>{next[staff][index][key]=value;})}/>)}
          {imageField(`Ảnh nhân sự ${index+1}`,person.avatar??'',url=>change(next=>{next[staff][index].avatar=url;}))}
          <div className="flex gap-4"><button type="button" disabled={index===0} onClick={()=>change(next=>{[next[staff][index-1],next[staff][index]]=[next[staff][index],next[staff][index-1]];})}>Đưa lên</button><button type="button" className="text-red-700" onClick={()=>change(next=>{next[staff].splice(index,1);})}>Bỏ nhân sự {index+1} khỏi bản nháp</button></div>
        </div>)}
        <button type="button" className="px-4 py-2 rounded-xl border" onClick={()=>change(next=>{next[staff].push({id:crypto.randomUUID(),name:'',avatar:''});})}>Thêm {staff==='leadershipHeads'?'lãnh đạo':'cố vấn'}</button>
      </section>}
      {tab==='Mạng lưới & cố vấn'&&Object.entries(draft.aboutInfo.partnerNetwork).map(([key,value]:[string,any])=><section key={key} className="border-t pt-5 space-y-3"><h3 className="font-bold uppercase">{key}</h3>{['regionName','summary'].map(field=><Field key={field} label={field==='regionName'?`Tên khu vực ${key}`:`Mô tả ${key}`} value={value[field]} onChange={v=>change(next=>{next.aboutInfo.partnerNetwork[key][field]=v;})}/>)}<Field label={`Danh sách địa điểm ${key} — mỗi dòng một nơi`} value={value.hubs.join('\n')} onChange={v=>change(next=>{next.aboutInfo.partnerNetwork[key].hubs=v.split('\n');})}/></section>)}
      {tab==='Lịch sử công ty'&&<section className="space-y-4">{draft.aboutInfo.timeline.map((item:any,index:number)=><div key={index} className="border rounded-xl p-4 space-y-3">{['year','title','description'].map(key=><Field key={key} label={`${key==='year'?'Năm':key==='title'?'Tiêu đề':'Mô tả'} mốc ${index+1}`} value={item[key]} onChange={value=>change(next=>{next.aboutInfo.timeline[index][key]=value;})}/>)}<label className="flex gap-2"><input type="checkbox" checked={!!item.isHighlight} onChange={e=>change(next=>{next.aboutInfo.timeline[index].isHighlight=e.target.checked;})}/>Đánh dấu nổi bật</label><button type="button" onClick={()=>change(next=>{next.aboutInfo.timeline.splice(index,1);})}>Bỏ mốc {index+1} khỏi bản nháp</button></div>)}<button type="button" className="border rounded-xl px-4 py-2" onClick={()=>change(next=>{next.aboutInfo.timeline.push({year:'',title:'',description:''});})}>Thêm mốc lịch sử</button></section>}
    </fieldset>
    {picker&&<ImagePickerModal isOpen onClose={()=>setPicker(null)} currentSelectedUrl={picker.url} onSelectImage={url=>{picker.apply(url);setPicker(null);}}/>}
  </div>;
}



