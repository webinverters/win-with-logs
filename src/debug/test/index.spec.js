var m=require('../index')

describe('grab line of error',function(){
  it('return a formated error message.',function(){
    function test(){
      throw new Error("hello")
    }

    return p.resolve()
      .then(test)
      .catch(m)
      .then(function(result){
        expect(result).to.deep.equal({ file: '/Users/tonyle/Desktop/repos/win-with-logs/src/debug/test/index.spec.js:',
            line: '6',
            func: 'test' }
        )
      })
  })
})