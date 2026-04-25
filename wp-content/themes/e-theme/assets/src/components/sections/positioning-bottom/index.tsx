'use client';

import BottomBlock from '../positioning/BottomBlock';
import type { PositioningBottomData } from '@/types/blocks';

interface Props { data?: PositioningBottomData }

const PositioningBottomSection = ({ data }: Props = {}) => {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1284px] w-full mx-auto">
        <BottomBlock data={data} />
      </div>
    </section>
  );
};

export default PositioningBottomSection;
