var m=require('../index')

describe('grab line of error',function(){
  it('return a formatted error message.',function(){
    function test(){
      throw new Error("hello")
    }

    return p.resolve()
      .then(test)
      .catch(m)
      .then(function(result){
        expect(result.file).to.include('win-with-logs/src/debug/test/index.spec.js');
        expect(result.line).to.equal('6');
        expect(result.func).to.equal('test')
      })
  })
})