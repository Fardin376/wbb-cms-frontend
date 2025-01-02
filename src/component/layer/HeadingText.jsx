import Container from './Container';
import PropTypes from 'prop-types';

const HeadingText = ({ text, className }) => {
  return (
    <div>
      <Container>
        <h2
          className={`text-primary font-bold font-inter text-4xl text-[#008645]  ${className}`}
        >
          {text}
        </h2>
      </Container>
    </div>
  );
};
HeadingText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default HeadingText;
