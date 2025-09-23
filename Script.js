// script.js
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.radius = 25;
        this.highlight = false;
        this.visited = false;
        this.traversal = false;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.canvas = document.getElementById('tree-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.messageEl = document.getElementById('message');
        this.animationSpeed = 500;
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.drawTree();
    }
    
    insert(value) {
        this.showMessage(`Inserting ${value}...`);
        const newNode = new TreeNode(value);
        
        if (this.root === null) {
            this.root = newNode;
            this.positionNodes();
            this.drawTree();
            setTimeout(() => {
                this.showMessage(`${value} inserted as root node!`);
            }, this.animationSpeed);
            return;
        }
        
        this.insertNode(this.root, newNode);
    }
    
    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
                this.positionNodes();
                this.drawTree();
                setTimeout(() => {
                    this.showMessage(`${newNode.value} inserted successfully!`);
                }, this.animationSpeed);
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
                this.positionNodes();
                this.drawTree();
                setTimeout(() => {
                    this.showMessage(`${newNode.value} inserted successfully!`);
                }, this.animationSpeed);
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    
    remove(value) {
        this.showMessage(`Deleting ${value}...`);
        this.root = this.removeNode(this.root, value);
    }
    
    removeNode(node, value) {
        if (node === null) {
            this.showMessage(`${value} not found in the tree!`);
            return null;
        }
        
        if (value < node.value) {
            node.left = this.removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this.removeNode(node.right, value);
            return node;
        } else {
            // Node found, now remove it
            if (node.left === null && node.right === null) {
                // Case 1: Leaf node
                this.showMessage(`${value} deleted successfully!`);
                this.positionNodes();
                this.drawTree();
                return null;
            }
            
            if (node.left === null) {
                // Case 2: Only right child
                this.showMessage(`${value} deleted successfully!`);
                this.positionNodes();
                this.drawTree();
                return node.right;
            } else if (node.right === null) {
                // Case 2: Only left child
                this.showMessage(`${value} deleted successfully!`);
                this.positionNodes();
                this.drawTree();
                return node.left;
            }
            
            // Case 3: Two children
            const minRight = this.findMinNode(node.right);
            node.value = minRight.value;
            node.right = this.removeNode(node.right, minRight.value);
            this.positionNodes();
            this.drawTree();
            return node;
        }
    }
    
    findMinNode(node) {
        if (node.left === null) {
            return node;
        } else {
            return this.findMinNode(node.left);
        }
    }
    
    search(value) {
        this.showMessage(`Searching for ${value}...`);
        this.resetHighlights();
        this.searchNode(this.root, value);
    }
    
    searchNode(node, value) {
        if (node === null) {
            this.showMessage(`${value} not found in the tree!`);
            this.drawTree();
            return;
        }
        
        node.visited = true;
        this.drawTree();
        
        if (value === node.value) {
            setTimeout(() => {
                node.highlight = true;
                this.drawTree();
                this.showMessage(`${value} found in the tree!`);
            }, this.animationSpeed);
            return;
        }
        
        if (value < node.value) {
            setTimeout(() => {
                this.searchNode(node.left, value);
            }, this.animationSpeed);
        } else {
            setTimeout(() => {
                this.searchNode(node.right, value);
            }, this.animationSpeed);
        }
    }
    
    inorder() {
        this.showMessage("Inorder Traversal: Left, Root, Right");
        this.resetHighlights();
        const result = [];
        this.inorderTraversal(this.root, result);
        this.animateTraversal(result, 0);
    }
    
    inorderTraversal(node, result) {
        if (node !== null) {
            this.inorderTraversal(node.left, result);
            result.push(node);
            this.inorderTraversal(node.right, result);
        }
    }
    
    preorder() {
        this.showMessage("Preorder Traversal: Root, Left, Right");
        this.resetHighlights();
        const result = [];
        this.preorderTraversal(this.root, result);
        this.animateTraversal(result, 0);
    }
    
    preorderTraversal(node, result) {
        if (node !== null) {
            result.push(node);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
    }
    
    postorder() {
        this.showMessage("Postorder Traversal: Left, Right, Root");
        this.resetHighlights();
        const result = [];
        this.postorderTraversal(this.root, result);
        this.animateTraversal(result, 0);
    }
    
    postorderTraversal(node, result) {
        if (node !== null) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node);
        }
    }
    
    animateTraversal(nodes, index) {
        if (index >= nodes.length) {
            setTimeout(() => {
                this.resetHighlights();
                this.drawTree();
                this.showMessage("Traversal completed!");
            }, this.animationSpeed);
            return;
        }
        
        nodes[index].traversal = true;
        this.drawTree();
        
        setTimeout(() => {
            nodes[index].traversal = false;
            this.animateTraversal(nodes, index + 1);
        }, this.animationSpeed);
    }
    
    positionNodes() {
        // Reset positions
        this.setNodePositions(this.root, 0, 0);
        
        // Calculate actual positions based on canvas size
        const levels = this.getDepth(this.root);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Position nodes with proper spacing
        this.positionNode(this.root, canvasWidth / 2, 80, canvasWidth / 4, 80);
    }
    
    setNodePositions(node, level, pos) {
        if (node !== null) {
            this.setNodePositions(node.left, level + 1, pos * 2);
            node.x = pos;
            node.y = level;
            this.setNodePositions(node.right, level + 1, pos * 2 + 1);
        }
    }
    
    positionNode(node, x, y, xOffset, yOffset) {
        if (node !== null) {
            node.x = x;
            node.y = y;
            
            if (node.left !== null) {
                this.positionNode(node.left, x - xOffset, y + yOffset, xOffset / 2, yOffset);
            }
            
            if (node.right !== null) {
                this.positionNode(node.right, x + xOffset, y + yOffset, xOffset / 2, yOffset);
            }
        }
    }
    
    getDepth(node) {
        if (node === null) {
            return 0;
        } else {
            const leftDepth = this.getDepth(node.left);
            const rightDepth = this.getDepth(node.right);
            return Math.max(leftDepth, rightDepth) + 1;
        }
    }
    
    drawTree() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connecting lines first (so they appear behind nodes)
        this.drawConnections(this.root);
        
        // Draw nodes
        this.drawNodes(this.root);
    }
    
    drawConnections(node) {
        if (node !== null) {
            if (node.left !== null) {
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(node.left.x, node.left.y);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.drawConnections(node.left);
            }
            
            if (node.right !== null) {
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(node.right.x, node.right.y);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.drawConnections(node.right);
            }
        }
    }
    
    drawNodes(node) {
        if (node !== null) {
            // Draw the node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            // Set node color based on state
            if (node.highlight) {
                this.ctx.fillStyle = '#38ada9'; // Found node
            } else if (node.traversal) {
                this.ctx.fillStyle = '#eb4d4b'; // Traversal path
            } else if (node.visited) {
                this.ctx.fillStyle = '#f6b93b'; // Visited node
            } else {
                this.ctx.fillStyle = '#4a69bd'; // Normal node
            }
            
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw the value
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.value.toString(), node.x, node.y);
            
            // Draw child nodes
            this.drawNodes(node.left);
            this.drawNodes(node.right);
        }
    }
    
    resetHighlights() {
        this.resetNodeStates(this.root);
    }
    
    resetNodeStates(node) {
        if (node !== null) {
            node.highlight = false;
            node.visited = false;
            node.traversal = false;
            this.resetNodeStates(node.left);
            this.resetNodeStates(node.right);
        }
    }
    
    showMessage(text) {
        this.messageEl.textContent = text;
        this.messageEl.style.opacity = '1';
        
        setTimeout(() => {
            this.messageEl.style.opacity = '0';
        }, 3000);
    }
    
    reset() {
        this.root = null;
        this.showMessage("Tree has been reset!");
        this.drawTree();
    }
}

// Initialize the BST and event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const bst = new BinarySearchTree();
    
    // Event listeners for buttons
    document.getElementById('insert-btn').addEventListener('click', () => {
        const value = parseInt(document.getElementById('node-value').value);
        if (!isNaN(value)) {
            bst.insert(value);
            document.getElementById('node-value').value = '';
        }
    });
    
    document.getElementById('delete-btn').addEventListener('click', () => {
        const value = parseInt(document.getElementById('delete-value').value);
        if (!isNaN(value)) {
            bst.remove(value);
            document.getElementById('delete-value').value = '';
        }
    });
    
    document.getElementById('search-btn').addEventListener('click', () => {
        const value = parseInt(document.getElementById('search-value').value);
        if (!isNaN(value)) {
            bst.search(value);
            document.getElementById('search-value').value = '';
        }
    });
    
    document.getElementById('inorder-btn').addEventListener('click', () => {
        bst.inorder();
    });
    
    document.getElementById('preorder-btn').addEventListener('click', () => {
        bst.preorder();
    });
    
    document.getElementById('postorder-btn').addEventListener('click', () => {
        bst.postorder();
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        bst.reset();
    });
    
    // Allow Enter key to trigger insert
    document.getElementById('node-value').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('insert-btn').click();
        }
    });
});