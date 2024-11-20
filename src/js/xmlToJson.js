function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  // If the current node is an element node
  if (xml.nodeType == 1) {
    // Process attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // If it's a text node, return its value
    obj = xml.nodeValue.trim();
  }

  // Process child nodes recursively
  if (xml.hasChildNodes()) {
    // Check for text-only children
    var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
      return node.nodeType === 3;
    });

    // If only text nodes, concatenate them
    if (xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
        return text + node.nodeValue.trim();
      }, "");
    } else {
      // Otherwise, process child elements
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;

        // Avoid overwriting keys by checking if the node already exists
        if (typeof obj[nodeName] === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          // If the key already exists, push the new item into an array
          if (Array.isArray(obj[nodeName])) {
            obj[nodeName].push(xmlToJson(item));
          } else {
            var old = obj[nodeName];
            obj[nodeName] = [old, xmlToJson(item)];
          }
        }
      }
    }
  }

  return obj;
}
export { xmlToJson };
