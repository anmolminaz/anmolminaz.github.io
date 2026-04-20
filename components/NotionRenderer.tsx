interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

interface NotionRendererProps {
  blocks: NotionBlock[];
}

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  const renderBlock = (block: NotionBlock) => {
    switch (block.type) {
      case 'heading_1':
        return (
          <h1 className="text-3xl font-bold mt-8 mb-4">
            {block.heading_1?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h1>
        );
      case 'heading_2':
        return (
          <h2 className="text-2xl font-semibold mt-6 mb-3">
            {block.heading_2?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h2>
        );
      case 'heading_3':
        return (
          <h3 className="text-xl font-medium mt-4 mb-2">
            {block.heading_3?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h3>
        );
      case 'paragraph':
        return (
          <p className="mb-4 leading-relaxed">
            {block.paragraph?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </p>
        );
      case 'bulleted_list_item':
        return (
          <li className="mb-2 ml-4">
            {block.bulleted_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </li>
        );
      case 'numbered_list_item':
        return (
          <li className="mb-2 ml-4">
            {block.numbered_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </li>
        );
      case 'image':
        const imageUrl = block.image?.type === 'file' ? block.image.file.url : block.image?.external?.url;
        return (
          <figure className="my-6">
            <img src={imageUrl} alt="" className="w-full max-w-2xl mx-auto rounded-lg" />
            {block.image?.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-2">
                {block.image.caption.map((text: any) => text.plain_text).join('')}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}