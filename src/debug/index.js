module.exports=function(e){
  if(!e.stack) return{};
  var line=e.stack.split('\n')[1];
  return {
    file:line.match(/at .+? \((.+?:)/)[1],
    line:line.match(/:(.+?):/)[1],
    func:line.match(/at (.+?) /)[1]
  }

};