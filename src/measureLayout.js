const ELEMENT_NODE = 1;

const getRect = (node) => {
  let {offsetParent} = node;
  const height = node.offsetHeight;
  const width = node.offsetWidth;
  let left = node.offsetLeft;
  let top = node.offsetTop;

  while (offsetParent && offsetParent.nodeType === ELEMENT_NODE) {
    left += offsetParent.offsetLeft - offsetParent.scrollLeft;
    top += offsetParent.offsetTop - offsetParent.scrollTop;
    ({offsetParent} = offsetParent);
  }

  return {
    height,
    left,
    top,
    width
  };
};

const measureLayout = (node, callback) => {
  const relativeNode = node && node.parentNode;

  if(!node){
     return;
  }

  if (relativeNode) {
    /* i.e. is a Web DOM node. */
    const relativeRect = getRect(relativeNode);
    const {height, left, top, width} = getRect(node);
    const x = left - relativeRect.left;
    const y = top - relativeRect.top;

    callback(x, y, width, height, left, top);
  } else {
    /* i.e. is a React Native node.
     * https://facebook.github.io/react-native/docs/direct-manipulation#other-native-methods */
    node.measure((fx, fy, width, height, px, py) => {
      var frameRect = {
        width: width,
        height: height,
        left: fx,
        top: fy,
      };
      var pageRect = {
        width: width,
        height: height,
        left: px,
        top: py,
      };
      
      /* Complete guess; probably wrong, as it's unlikely to be equivalent to the available DOM properties. */
      var x = pageRect.left - frameRect.left;
      var y = pageRect.top - frameRect.top;

      callback(x, y, frameRect.width, frameRect.height, frameRect.left, frameRect.top);
    });

  }
};

export default measureLayout;