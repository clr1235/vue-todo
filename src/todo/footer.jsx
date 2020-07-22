import '../assets/styles/footer.scss'

export default {
  data(){
    return {
      author: '哈哈哈'
    }
  },
  render() {
    return (
      <div id="footer">
        <span>written by {this.author}</span>
      </div>
    )
  }
}

