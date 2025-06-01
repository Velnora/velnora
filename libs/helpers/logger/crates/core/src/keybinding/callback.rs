pub trait CloneFnMut: FnMut() + Send + Sync + 'static {
    fn clone_box(&self) -> Box<dyn CloneFnMut>;
}

impl<T> CloneFnMut for T
where
    T: FnMut() + Clone + Send + Sync + 'static,
{
    fn clone_box(&self) -> Box<dyn CloneFnMut> {
        Box::new(self.clone())
    }
}

impl Clone for Box<dyn CloneFnMut> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}