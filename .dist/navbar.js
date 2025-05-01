const Navbar = () => (
    <nav className="bg-green-500 flex justify-center space-x-4 text-white p-3">
      {['Crop Suggestions', 'Weather Forecast', 'Govt. Schemes', 'Pest Management', 'Drone Rental', 'Manure Marketplace'].map((item, i) => (
        <a
          key={i}
          href={`#${item.toLowerCase().replace(/\\s+/g, '')}`}
          className="hover:bg-green-700 px-3 py-1 rounded"
        >
          {item}
        </a>
      ))}
    </nav>
  );
  
  export default Navbar;
  