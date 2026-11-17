import { notFound } from "next/navigation";
import { getPublicSite } from "../../../server/site";
import { catalogImage, isPriceService, phoneDigits } from "../../../lib/site-data";
import "../../service-template.css";

export default async function ServicePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const site=await getPublicSite();
  const service=site.serviceCatalog.find(item=>item.slug===slug&&!isPriceService(item.id));
  if(!service)notFound();
  const copy=site.pageContent["service-template"].general;
  const packages=site.customPlans.filter(item=>item.serviceId===service.id);
  const register="/?solution="+encodeURIComponent(service.id)+"#register";
  return <div className="new-service-page">
    <header className="header"><div className="wrap header-inner"><a className="brand brand-text" href="/">VIETTEL ĐỒNG NAI</a><a className="btn btn-red" href={register}>{copy.consult}</a></div></header>
    <main className="wrap">
      <a className="new-service-back" href="/#solutions">← {copy.back}</a>
      <section className="new-service-hero"><div><span className="eyebrow red">{service.category}</span><h1>{service.detailTitle}</h1><p>{service.detailIntro}</p><a className="btn btn-red" href={register}>{copy.consult}</a></div><img src={catalogImage(service,site.media)} alt={service.name}/></section>
      {service.points.length>0&&<section className="new-service-section"><h2>{copy.benefits}</h2><ul>{service.points.map((line,index)=><li key={index}>{line}</li>)}</ul></section>}
      {service.detailContent&&<section className="new-service-section"><h2>{copy.content}</h2><p className="new-service-text">{service.detailContent}</p></section>}
      {packages.length>0&&<section className="new-service-section"><h2>{copy.prices}</h2><div className="new-service-plans">{packages.map(item=><article key={item.id}><h3>{item.name}</h3><strong>{item.price===null?copy.contact:new Intl.NumberFormat("vi-VN").format(item.price)+"đ"}</strong><p>{item.duration}</p><p>{item.vatNote}</p><ul>{item.details.map((text,index)=><li key={index}>{text}</li>)}</ul><a className="btn btn-red" href={"/?solution="+encodeURIComponent(service.id)+"&service_quote="+encodeURIComponent(item.id)+"#register"}>{copy.buy}</a></article>)}</div></section>}
      <section className="new-service-section"><h2>{copy.contact}</h2><p>{site.contact.name} · {site.contact.role}</p><a href={"tel:"+phoneDigits(site.contact.hotline)}>{site.contact.hotline}</a></section>
    </main>
  </div>;
}
