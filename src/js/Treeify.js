function printNode(node, indent, lastChar) {
  const lines = node.label.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (i === lines.length - 1) {
      console.log(`${indent}${lastChar} ${line}`);
    } else {
      console.log(`${indent}│ ${line}`);
    }
  }
}

function prettyPrint(node, indent, last) {
  if (last) {
    printNode(node, indent, "└");
    indent += " ";
  } else {
    printNode(node, indent, "├");
    indent += "│";
  }

  for (let i = 0; i < node.children.length; i++) {
    prettyPrint(node.children[i], indent, i == node.children.length - 1);
  }
}

module.exports = {
  asTree(node) {
    prettyPrint(node, "", node.children.length === 1);
  },
};
