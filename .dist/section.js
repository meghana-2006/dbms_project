const Section = ({ id, title, description }) => (
    <div id={id} className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
  export default Section;
  