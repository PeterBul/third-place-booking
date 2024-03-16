import { useQuery } from '@tanstack/react-query';
import { getItems } from '../../api/items';
import './GearShare.css';

const GearShare = () => {
  const items = useQuery({ queryKey: ['items'], queryFn: getItems });
  return (
    <>
      <section className="top-section sm gear-share-hero">
        <hgroup>
          <p className="text-fun">Welcome to</p>
          <h1 className="text-8xl weight-400">Third place</h1>
          <p className="text-fun">What a day to rent some stuff!</p>
        </hgroup>
      </section>
      <section className="xl">
        <div className={'booking-items'}>
          {items.data?.map((item) => (
            <div key={item.id} className="item-wrapper">
              <div
                style={{ backgroundImage: `url(${item.image.url})` }}
                title={item.image.alt}
                className="item-bg-image"
              />
              <h2 className="text-3xl item-title">{item.title}</h2>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default GearShare;
