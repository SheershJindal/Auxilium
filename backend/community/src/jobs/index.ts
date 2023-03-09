import Container from 'typedi';
import TagJob from './tags';

const JobFactory = () => {
  Container.get(TagJob);
};

export default JobFactory;
