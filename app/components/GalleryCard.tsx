import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
};

export default function GalleryCard({ src, alt = "" }: Props) {
  return (
    <div className="relative overflow-hidden rounded-md bg-slate-50 border border-slate-100 shadow-sm">
      <div className="aspect-[3/4] w-full">
        <div className="relative h-full w-full">
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
